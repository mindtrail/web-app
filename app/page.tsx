import { Header } from '@/components/header'
import { ChatDemo } from '@/components/chat/demo'

export default function Home() {
  return (
    <div className='flex flex-col flex-1 w-full items-center bg-muted/50'>
      <Header />
      <div className='flex flex-col flex-1 w-full max-w-6xl'>
        <div className='flex flex-col flex-1 w-full items-center px-6 cursor-default'>
          <section className='flex flex-col w-full h-64 py-12 gap-2 items-center'>
            <h1 className='text-xl'>Indie Chat</h1>
            <h2 className='text-lg text-gray-500'>
              An AI-Powered chatbot for your docs and website.
            </h2>
          </section>
          <section className='flex w-full'>
            <ChatDemo />
          </section>
          <section>
            <h3 className='text-lg'>Features</h3>
            <ul className='text-sm text-gray-500'>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </section>
          <section>
            <h3 className='text-lg'>Pricing</h3>
            <p className='text-sm text-gray-500'>Free</p>
            <p className='text-sm text-gray-500'>Hooby</p>
            <p className='text-sm text-gray-500'>Pro</p>
            <p className='text-sm text-gray-500'>Enterprise</p>
          </section>
        </div>
      </div>
    </div>
  )
}
