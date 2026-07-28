import { useState } from 'react';
import { motion } from 'motion/react';
import { HiMagnifyingGlass, HiShieldCheck, HiUser } from 'react-icons/hi2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getAllUsers, setUserRole } from '@/firebase/users';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Pagination from '@/components/ui/Pagination';
import { formatDate } from '@/utils/helpers';
import useDebounce from '@/hooks/useDebounce';
import { useAuth } from '@/hooks/useAuth';

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [roleChangeUser, setRoleChangeUser] = useState(null);
  
  const itemsPerPage = 10;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ uid, role }) => setUserRole(uid, role),
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries(['admin-users']);
      setRoleChangeUser(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update user role');
      setRoleChangeUser(null);
    }
  });

  const filteredUsers = users.filter(user => {
    const searchStr = `${user.name || ''} ${user.email || ''}`.toLowerCase();
    return searchStr.includes(debouncedSearch.toLowerCase());
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleRoleChange = () => {
    if (roleChangeUser) {
      const newRole = roleChangeUser.role === 'admin' ? 'user' : 'admin';
      roleMutation.mutate({ uid: roleChangeUser.id, role: newRole });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage registered users and their roles.</p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative max-w-md w-full">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 text-gray-400">
              <HiUser className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedUsers.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={user.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-lg">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="font-medium text-gray-900 dark:text-white">{user.name || 'Unknown User'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'admin' ? 'purple' : 'default'}>
                        {user.role || 'user'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {currentUser?.uid !== user.id && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setRoleChangeUser(user)}
                          className="flex items-center gap-2 ml-auto"
                        >
                          {user.role === 'admin' ? (
                            <>
                              <HiUser className="w-4 h-4" />
                              Make User
                            </>
                          ) : (
                            <>
                              <HiShieldCheck className="w-4 h-4" />
                              Make Admin
                            </>
                          )}
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!roleChangeUser}
        onClose={() => setRoleChangeUser(null)}
        onConfirm={handleRoleChange}
        title="Change User Role"
        description={`Are you sure you want to change ${roleChangeUser?.name || 'this user'}'s role to ${roleChangeUser?.role === 'admin' ? 'user' : 'admin'}?`}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="primary"
        isLoading={roleMutation.isPending}
      />
    </div>
  );
}
