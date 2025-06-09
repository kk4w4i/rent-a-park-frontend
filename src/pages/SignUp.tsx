import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"

export default function SignUp() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const { register, isLoading } = useAuthContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password, phone, firstname, lastname, isProvider.toString(), username);
    } catch (err) {
      setError("Registration failed. Please check your details.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="/" className="flex flex-col items-center gap-2 font-medium">
              <span className="sr-only">Rent-a-Park</span>
            </a>
            <h1 className="text-xl font-bold">Create your account</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/sign-in" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="rentapark" required
                value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="0412 345 678" required
                value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="firstname">First Name</Label>
              <Input id="firstname" type="text" required
                value={firstname} onChange={e => setFirstname(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" type="text" required
                value={lastname} onChange={e => setLastname(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input id="is_provider" type="checkbox" className="accent-primary"
                checked={isProvider} onChange={e => setIsProvider(e.target.checked)} />
              <Label htmlFor="is_provider">Register as Provider</Label>
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}