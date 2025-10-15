
import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../component/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../component/ui/avatar';
import { Button } from '../component/ui/button';
import { Input } from '../component/ui/input';
import { Label } from '../component/ui/label';
import { Textarea } from '../component/ui/textarea';
import { RefreshCw } from 'lucide-react';
import UserService from '../service/UserService';
import { useApp } from '../context/AppContext';

const ProfilePage = () => {
  const { user, fetchUser, updateUser, isLoadingUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [message, setMessage] = useState({ text: '', isError: false });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user from context (will use cache if available)
    if (!user) {
      fetchUser();
    } else {
      setEditedUser(user);
    }
  }, [user, fetchUser]);

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage({ text: '', isError: false }), 4000);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser(user); // Reset changes on cancel
  };

    const getRoleDisplayName = (role) => {
        if (!role) return 'User';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.updateUser(editedUser.id, editedUser);
      updateUser(editedUser); // Update in context
      setIsEditing(false);
      showMessage(response.message || 'Profile updated successfully!');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error updating profile', true);
    }
  };

  if (isLoadingUser) {
    return (
      <Layout>
        <main className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col items-center gap-4'>
            <RefreshCw className='h-8 w-8 animate-spin text-primary' />
            <p className='text-muted-foreground'>Loading user profile...</p>
          </div>
        </main>
      </Layout>
    );
  }

  if (error && !user) {
    return (
      <Layout>
        <main className='flex flex-1 items-center justify-center'>
          <Card className='max-w-md'>
            <CardHeader>
              <CardTitle className='text-destructive'>Error Loading Profile</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className='flex-1 p-4 md:p-8'>
        <Card className='max-w-2xl mx-auto'>
          <CardHeader>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16'>
                <AvatarImage src={user.image || '/placeholder-user.jpg'} alt={user.name} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className='text-2xl'>{user.name}</CardTitle>
                <CardDescription>{getRoleDisplayName(user.role)}</CardDescription>
              </div>
            </div>
            {message.text && 
              <p className={`mt-4 text-sm ${message.isError ? 'text-destructive' : 'text-primary'}`}>
                {message.text}
              </p>
            }
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input id='name' value={editedUser.name} onChange={handleInputChange} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input id='email' type='email' value={editedUser.email} onChange={handleInputChange} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  <Textarea id='bio' value={editedUser.bio || ''} onChange={handleInputChange} placeholder='A short bio about yourself.' />
                </div>
                <div className='flex justify-end gap-2'>
                  <Button type='button' variant='outline' onClick={handleEditToggle}>Cancel</Button>
                  <Button type='submit'>Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className='space-y-4'>
                <div>
                  <h3 className='font-semibold'>Email</h3>
                  <p>{user.email}</p>
                </div>
                <div>
                  <h3 className='font-semibold'>Bio</h3>
                  <p>{user.bio || 'No bio provided.'}</p>
                </div>
                <Button onClick={handleEditToggle}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default ProfilePage;
