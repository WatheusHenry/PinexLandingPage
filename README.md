# Landing Page com Captura de Email

Landing page minimalista com hero e captura de email usando Resend.

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure a API key do Resend:
   - Copie `.env.local.example` para `.env.local`
   - Adicione sua chave API do Resend: https://resend.com/api-keys

3. Execute o projeto:
```bash
npm run dev
```

4. Acesse: http://localhost:3000

## Personalização

- Edite `components/Hero.tsx` para alterar textos e estilos
- Modifique `app/api/subscribe/route.ts` para customizar o email enviado
- Altere o `from` no route.ts para usar seu domínio verificado no Resend

## Deploy

Recomendado: Vercel (https://vercel.com)

Não esqueça de adicionar a variável de ambiente `RESEND_API_KEY` no painel do Vercel.
