import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import WelcomeEmail from '@/emails/WelcomeEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Enviar email de confirmação com template
    await resend.emails.send({
      from: 'Pinex <onboarding@pinex.site>', // Substitua pelo seu domínio verificado
      to: email,
      subject: 'Você está na lista! 🎉 Acesso exclusivo ao Pinex',
      react: WelcomeEmail({ userEmail: email }),
    })

    // Aqui você pode salvar o email em um banco de dados
    // await db.subscribers.create({ email })

    return NextResponse.json(
      { message: 'Email cadastrado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao processar cadastro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar cadastro' },
      { status: 500 }
    )
  }
}
