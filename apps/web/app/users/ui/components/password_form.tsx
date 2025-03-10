import React from 'react'
import { useForm } from '@inertiajs/react'

import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import { Progress } from '@workspace/ui/components/progress'

import { toast } from '@workspace/ui/hooks/use-toast'
import { PasswordInput } from '@workspace/ui/components/password-input'

export function PasswordForm() {
  const { data, setData, errors, put, progress, reset } = useForm({
    password: '',
    passwordConfirmation: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    put('/settings/password', {
      preserveScroll: true,
      onSuccess: () => {
        reset()

        toast({
          title: 'Success',
          description: 'Password updated successfully',
        })
      },
      onError: () => {
        reset()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-0.5">
      <div>
        <Label htmlFor="password" className="mb-1 text-gray-700">
          Password
        </Label>
        <PasswordInput
          id="password"
          placeholder="e.g., S3cur3P@ssw0rd"
          value={data.password}
          onChange={(element) => setData('password', element.target.value)}
          className={`${errors?.password ? 'border-red-500' : ''}`}
        />
        <p className="text-[0.8rem] font-medium text-destructive col-span-4 col-start-3">
          {errors?.password}
        </p>
      </div>

      <div>
        <Label htmlFor="passwordConfirmation" className="mb-1 text-gray-700">
          Confirm Password
        </Label>
        <PasswordInput
          id="passwordConfirmation"
          disabled={data.password === ''}
          placeholder="e.g., S3cur3P@ssw0rd"
          value={data.passwordConfirmation}
          onChange={(element) => setData('passwordConfirmation', element.target.value)}
          className={`${errors?.passwordConfirmation ? 'border-red-500' : ''}`}
        />
        <p className="text-[0.8rem] font-medium text-destructive col-span-4 col-start-3">
          {errors?.passwordConfirmation}
        </p>
      </div>

      {progress && (
        <Progress
          value={progress.percentage}
          max={100}
          className="w-full h-2 bg-gray-200 rounded mt-2"
        />
      )}

      <div className="pt-2">
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
