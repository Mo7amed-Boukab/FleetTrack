import Header from "../components/Header";

const ChauffeursPage = () => {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Chauffeurs" description="Gestion des chauffeurs" />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <p className="text-gray-600">Contenu de la page Chauffeurs</p>
        </div>
      </div>
    </div>
  );
};

export default ChauffeursPage;
