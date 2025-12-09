import Header from "../components/Header";

const RemorquesPage = () => {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Remorques" description="Gestion des remorques" />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <p className="text-gray-600">Contenu de la page Remorques</p>
        </div>
      </div>
    </div>
  );
};

export default RemorquesPage;
