import type { ReactNode } from "react";

interface IModalProps {
  close: () => void;
  title: string;
  description: string;
  children: ReactNode;
  maxWeight?: "max-w-3xl" | "max-w-lg";
}

const Modal = ({
  close,
  title,
  description,
  children,
  maxWeight="max-w-3xl",
}: IModalProps) => {
  return (
    <main>
      <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div className="fixed inset-0"></div>
        <div
          className={`relative z-60 bg-white rounded-2xl shadow-2xl w-full my-8 animate-fade-in transition-transform duration-300 ${maxWeight}`}
        >
          <div className="flex items-center justify-between p-6 pb-0 ">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              onClick={close}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x w-5 h-5"
                aria-hidden="true"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default Modal;
