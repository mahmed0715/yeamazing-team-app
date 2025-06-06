'use client';

import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';

import Input from "../inputs/Input";
import Modal from '../modals/Modal';
import Button from '../Button';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser = {}
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  console.log(currentUser, '&TEST_CURRENT_USER')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: (currentUser as User)?.name,
      image: (currentUser as User)?.image
    }
  });

  const image = watch('image');

  const handleUpload = (result: any) => {
    setValue('image', result.info.secure_url, { 
      shouldValidate: true 
    });
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/settings', data)
    .then(() => {
      router.refresh();
      onClose();
    })
    .catch(() => toast.error('Something went wrong!'))
    .finally(() => setIsLoading(false));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="pb-12 border-b border-gray-900/10">
            <h2 
              className="text-base font-semibold leading-7 text-gray-900 "
            >
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information.
            </p>

            <div className="flex flex-col mt-10 gap-y-8">
              <Input
                disabled={isLoading}
                label="Name" 
                id="name" 
                errors={errors} 
                required 
                register={register}
              />
              <div>
                <label 
                  htmlFor="photo" 
                  className="block text-sm font-medium leading-6 text-gray-900 "
                >
                  Photo
                </label>
                <div className="flex items-center mt-2 gap-x-3">
                  <Image
                    width="48"
                    height="48" 
                    className="rounded-full" 
                    src={image || (currentUser as any)?.image || '/images/placeholder.jpg'}
                    alt="Avatar"
                  />
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="flex items-center justify-end mt-6 gap-x-6"
        >
          <Button 
            disabled={isLoading}
            secondary 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            disabled={isLoading}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal;
