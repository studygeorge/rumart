// backend/src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { registerSchema } from '@/lib/validators/auth'
import { hashPassword } from '@/lib/auth/hash'
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json()
    
    const validation = registerSchema.safeParse(rawBody)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { email, phone, password, firstName, lastName } = validation.data

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email или телефоном уже существует' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash: passwordHash,
        firstName: firstName || null,
        lastName: lastName || null
      }
    })

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    const deviceId = (rawBody as { deviceId?: string }).deviceId || `device_${Date.now()}`
    const deviceName = (rawBody as { deviceName?: string }).deviceName || 'Unknown Device'

    await prisma.session.create({
      data: {
        userId: user.id,
        deviceId,
        deviceName,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        refreshToken,
        expiresAt: getRefreshTokenExpiry()
      }
    })

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || null

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        name: fullName,
        role: user.role,
        pinEnabled: user.pinEnabled
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    )
  }
}