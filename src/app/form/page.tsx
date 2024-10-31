import { Suspense } from "react";
import FormPageWithoutSuspense from "./layout";

const FormPage: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <FormPageWithoutSuspense />
    </Suspense>
);

export default FormPage;
