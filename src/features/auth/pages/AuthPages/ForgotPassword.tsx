import { PageMeta } from '@nthucscc/components-shared';
import AuthLayout from './AuthPageLayout';
import ForgotPasswordForm from '@nthucscc/components-shared/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <>
      <PageMeta title="Reset Password" description="Reset your password" />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}
