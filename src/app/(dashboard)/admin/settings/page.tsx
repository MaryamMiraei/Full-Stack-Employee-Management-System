import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/TextArea";


const AdminSettingsPage = () => {
  return (
    <div className="p-5 sm:p-6 mb-6 bg-slate-100">
      <header className="ml-15 lg:ml-0 mb-8">
        <div>
          <h1 className="font-bold text-xl">Settings</h1>
          <p className="text-gray-500 text-sm">
            Manage your account and preferences
          </p>
        </div>
      </header>

      <main className="p-5 sm:p-6 mb-6">
        <form className="border border-slate-200/70 shadow-2xl rounded-xl p-5 bg-white">
          <h2 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
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
              className="lucide lucide-user w-5 h-5 text-slate-400"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Public Profile
          </h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="name" label="Name" type="text" />
              <Input id="email" label="Email" type="email" />
              <div className="sm:col-span-2">
                <Input id="position" label="Position" type="text" />
              </div>
            </div>
            <div>
              <Textarea
                placeholder="Write a brief bio..."
                label="Bio"
                id="bio"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                This will be displayed on your profile.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <Button>
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
                  className="lucide lucide-save w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                  <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                  <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
                </svg>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminSettingsPage;
