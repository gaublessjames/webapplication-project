import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react";

// Define our own error type to replace Supabase's AuthError
interface AuthError {
  message: string;
}

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, login } = useApi();
  const { setUser, setRole } = useAuth();
  const [verificationLink, setVerificationLink] = useState<string | null>(null);
  const [verificationNote, setVerificationNote] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await auth.getSession();
      if (data.session?.user) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  // Pre-fill signup form if signup=1 and email are in query
  useEffect(() => {
    const signup = searchParams.get("signup");
    const emailParam = searchParams.get("email");
    if (signup === "1") {
      setIsLogin(false);
      if (emailParam) setEmail(emailParam);
    }
  }, [searchParams]);

  // Function to create demo user if it doesn't exist
  const createDemoUser = async () => {
    try {
      const response = await register('demo@cafefausse.com', 'demo123456', 'Demo User');
      
      if (response.error && response.error !== 'User already registered') {
        console.error('Error creating demo user:', response.error);
      } else {
        console.log('Demo user created or already exists');
      }
    } catch (error) {
      console.error('Error creating demo user:', error);
    }
  };

  // Create demo user on component mount
  useEffect(() => {
    createDemoUser();
  }, []);

  // Helper to fetch the verification link for a given email
  const fetchVerificationLink = async (email: string) => {
    try {
      const apiUrl = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${apiUrl}/auth/verification-link?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Could not fetch verification link.');
      const data = await res.json();
      if (data.verification_link) {
        setVerificationLink(data.verification_link);
        setVerificationNote('You can simulate email verification below.');
      } else {
        setVerificationLink(null);
        setVerificationNote('No verification link available. Please try signing up again.');
      }
    } catch (err: any) {
      setVerificationLink(null);
      setVerificationNote('Could not fetch verification link. Please try signing up again.');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationLink(null);
    setVerificationNote(null);
    setVerificationSuccess(false);

    // Remove local admin bypass: always use backend authentication

    try {
      if (isLogin) {
        // Sign in with email/password
        const response = await login(email, password);
        
        if (response.error) throw new Error(response.error);
        
        if (response.user) {
          setUser(response.user);
          setRole(response.user.role || null);
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          if (response.user.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        // Sign up with email/password
        const response = await register(email, password, fullName);

        if (response.error) throw new Error(response.error);

        if (response.verification_link) {
          setVerificationLink(response.verification_link);
          setVerificationNote(response.note || null);
        }
      }
    } catch (error: any) {
      const authError = error as AuthError;
      setError(authError.message || "An error occurred during authentication");
      // If the error is about email verification, fetch the actual verification link
      if (authError.message && authError.message.includes('Please verify your email')) {
        fetchVerificationLink(email);
      }
      toast({
        title: "Authentication Error",
        description: authError.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulate clicking the verification link
  const handleSimulateVerify = async () => {
    if (!verificationLink) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(verificationLink);
      const data = await res.json();
      if (res.ok && data.message) {
        setVerificationSuccess(true);
        setVerificationNote(data.message);
        // Debug: log before redirect
        console.log('Redirecting to /auth after verification');
        if (window.location.pathname !== '/auth') {
          navigate('/auth');
          console.log('Navigation to /auth triggered');
        } else {
          console.log('Already on /auth route, no navigation needed');
        }
        toast({
          title: "User verified",
          description: "You can now log in.",
        });
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-all duration-300 transform hover:scale-105">
              Café Fausse
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-primary-600 hover:text-primary-700 transition-all duration-300 font-medium hover:bg-primary-50 px-3 py-2 rounded-lg">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? "Welcome back" : "Join Café Fausse"}
              </CardTitle>
              <CardDescription className="text-primary-100">
                {isLogin 
                  ? "Sign in to your account to continue" 
                  : "Create your account and start making reservations"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 p-8">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Simulated Email Verification Flow */}
              {verificationLink && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex flex-col items-center">
                  <Button
                    type="button"
                    className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded"
                    onClick={handleSimulateVerify}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Simulate Email Verification"}
                  </Button>
                </div>
              )}

              {/* Demo Credentials - only show on login, not signup, and not after registration */}
              {isLogin && !verificationLink && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">🧪 Demo Credentials (For Testing)</h4>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Customer Email:</strong> demo@cafefausse.com</p>
                    <p><strong>Admin Email:</strong> admin@cafefausse.com</p>
                    <p><strong>Password:</strong> demo123456</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                          setEmail('demo@cafefausse.com');
                          setPassword('demo123456');
                        }}
                      >
                        Use Customer Demo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                          setEmail('admin@cafefausse.com');
                          setPassword('demo123456');
                        }}
                      >
                        Use Admin Demo
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Email/Password Form - hide if verificationLink is shown and not yet verified */}
              {!verificationLink && (
                <form onSubmit={handleAuth} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 font-semibold">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                        className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 pl-10 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 pl-10 pr-10 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Please wait...
                      </div>
                    ) : (
                      isLogin ? "Sign In" : "Create Account"
                    )}
                  </Button>
                </form>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setEmail("");
                    setPassword("");
                    setFullName("");
                    setVerificationLink(null);
                    setVerificationNote(null);
                  }}
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors duration-300"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;