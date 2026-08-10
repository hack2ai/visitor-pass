import MainLayout from "../../components/layout/MainLayout";

const Profile = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-6">
            <img
              src="https://ui-avatars.com/api/?name=Pankaj+Kumar&background=2563eb&color=fff&size=128"
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />

            <div>
              <h2 className="text-2xl font-bold">
                Pankaj Kumar
              </h2>

              <p className="text-gray-500">
                Administrator
              </p>

              <p className="text-gray-500">
                admin@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;