import jsonwebtoken from 'jsonwebtoken'

export async function GET(request: Request) {
  const currentTime = Math.floor(Date.now() / 1000)
  const expires = currentTime + 60 * 60 * 24 * 7
  const token = jsonwebtoken.sign(
    {
      exp: expires,
      iat: currentTime,
      sub: process.env.PRISMATIC_CUSTOMER_APP_ID,
      external_id: process.env.PRISMATIC_CUSTOMER_APP_ID,
      name: process.env.PRISMATIC_CUSTOMER_APP_NAME,
      organization: process.env.PRISMATIC_ORGANIZATION_ID,
      customer: process.env.PRISMATIC_CUSTOMER_ID,
    },
    process.env.PRISMATIC_PRIVATE_KEY!,
    {
      algorithm: 'RS256',
    },
  )
  return Response.json({ token })
}
