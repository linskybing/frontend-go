import { PageMeta } from '@nthucscc/components-shared';
import AuthLayout from './AuthPageLayout';
import SignUpForm from '@nthucscc/components-shared/auth/SignUpForm';

export default function SignUp() {
  return (
    <>
      <PageMeta title="Sign Up | AI Platform" description="Sign up page for AI Platform" />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
