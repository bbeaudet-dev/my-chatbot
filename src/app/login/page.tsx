import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "~/components/login-form"

export default function LoginPage () {
      return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-[#F5E6D3]">
                  <div className="flex w-full max-w-sm flex-col gap-6">
                        <div className="bg-[#2C1810]/90 backdrop-blur-sm rounded-lg border-2 border-[#8B4513] p-4">
                              <a href="/" className="flex items-center gap-2 self-center">
                                    <div className="bg-[#8B4513] text-[#D4AF37] flex size-8 items-center justify-center rounded-md">
                                          <GalleryVerticalEnd className="size-5" />
                                    </div>
                                    <span className="text-[#D4AF37] font-serif text-xl">RiddleBot 🎩✨</span>
                              </a>
                        </div>
                        <div className="bg-[#F5E6D3]/90 backdrop-blur-sm rounded-lg border-2 border-[#8B4513] p-6">
                              <LoginForm />
                        </div>
                  </div>
            </div>
      )
}
