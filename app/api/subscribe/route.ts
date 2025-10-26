import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

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

    // Enviar email de confirmação
    await resend.emails.send({
      from: 'onboarding@pinex.site', // Substitua pelo seu domínio verificado
      to: email,
      subject: 'Bem-vindo!',
      html: `
        <h1>Obrigado por se cadastrar!</h1>
        <p>Você receberá nossas novidades em breve.</p>
      `,
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
