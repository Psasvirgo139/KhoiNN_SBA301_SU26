import { FormProvider } from '../context/FormContext';
import RegistrationForm from '../components/form/RegistrationForm';

export default function Ex03ValidationPage() {
  return (
    <FormProvider>
      <div className="container max-w-lg mx-auto my-5 p-4 bg-light rounded shadow-sm border border-light">
        <h1 className="text-center mb-4 fs-3 fw-bold text-dark">Bài 3 – Validation Form</h1>
        <div className="py-3">
          <RegistrationForm />
        </div>
      </div>
    </FormProvider>
  );
}
