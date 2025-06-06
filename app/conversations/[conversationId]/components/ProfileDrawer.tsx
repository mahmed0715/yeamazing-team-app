'use client';

import { Fragment, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoClose, IoTrash } from 'react-icons/io5'
import { Conversation, User } from '@prisma/client';
import { format } from 'date-fns';

import useOtherUser from '@/app/hooks/useOtherUser';
import useActiveList from '@/app/hooks/useActiveList';

import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import ConfirmModal from './ConfirmModal';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[]
  }
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const otherUser = useOtherUser(data);
  
  const joinedDate = useMemo(() => {
    return format(new Date(otherUser?.createdAt || ''), 'PP');
  }, [otherUser?.createdAt]);
  
  const title = useMemo(() => {
    return data.name || otherUser?.name;
  }, [data.name, otherUser?.name]);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline'
  }, [data, isActive]);

  return (
    <>
      <ConfirmModal 
        isOpen={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
                    <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-end">
                          <div className="flex items-center ml-3 h-7">
                            <button
                              type="button"
                              className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose size={24} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative flex-1 px-4 mt-6 sm:px-6">
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            {data.isGroup ? <AvatarGroup users={data.users} /> : <Avatar user={otherUser} />}
                          </div>
                          <div>
                            {title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {statusText}
                          </div>
                          
                        <div className="w-full pt-5 pb-5 sm:px-0 sm:pt-0">
                        <dl className="px-4 space-y-8 sm:space-y-6 sm:px-6">
                          {data.isGroup && (
                            <div>
                              <dt 
                                className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0"
                              >
                                Emails
                              </dt>
                              <dd 
                                className="mt-1 text-sm text-gray-900 sm:col-span-2"
                              >
                                {data.users.map((user) => user.email).join(', ')}
                              </dd>
                            </div>
                          )}
                          {!data.isGroup && (
                            <div>
                              <dt 
                                className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0"
                              >
                                Email
                              </dt>
                              <dd 
                                className="mt-1 text-sm text-gray-900 sm:col-span-2"
                              >
                                {otherUser?.email}
                              </dd>
                            </div>
                          )}
                          {!data.isGroup && (
                            <>
                              <hr />
                              <div>
                                <dt 
                                  className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0"
                                >
                                  Joined
                                </dt>
                                <dd 
                                  className="mt-1 text-sm text-gray-900 sm:col-span-2"
                                >
                                  <time dateTime={joinedDate}>
                                    {joinedDate}
                                  </time>
                                </dd>
                              </div>
                            </>
                          )}
                        </dl>
                      </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default ProfileDrawer;
