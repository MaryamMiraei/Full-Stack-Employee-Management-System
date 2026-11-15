import { Suspense } from "react";
import PayslipDownload from "./components/PayslipDownload";

const PayslipByIdPage = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <PayslipDownload />
      </Suspense>
    </div>
  );
};

export default PayslipByIdPage;
