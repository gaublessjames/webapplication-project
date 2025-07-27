import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';

const AuthDebugPanel = () => {
  const { user, session, loading, profile, role, refreshAuth } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        size="sm"
        className="mb-2"
      >
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        Auth Debug
      </Button>
      
      {isVisible && (
        <Card className="w-80 bg-white/95 backdrop-blur-md border-2 border-primary-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              Authentication State
              <Button
                onClick={refreshAuth}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge variant={loading ? "secondary" : user ? "default" : "destructive"}>
                {loading ? "Loading..." : user ? "Logged In" : "Not Logged In"}
              </Badge>
            </div>
            
            {user && (
              <>
                <div>
                  <span className="font-medium">User:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {role || 'None'}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {user.id}
                </div>
                {profile && (
                  <div>
                    <span className="font-medium">Profile:</span> {profile.full_name}
                  </div>
                )}
              </>
            )}
            
            <div className="pt-2 border-t">
              <span className="font-medium">Session:</span> {session ? 'Active' : 'None'}
            </div>
            
            <div className="pt-2 border-t">
              <span className="font-medium">JWT Token:</span> {localStorage.getItem('jwt') ? 'Present' : 'None'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuthDebugPanel; 