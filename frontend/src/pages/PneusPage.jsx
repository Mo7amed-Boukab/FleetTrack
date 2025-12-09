import Header from "../components/Header";

const PneusPage = () => {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Pneus" description="Suivi et gestion des pneus" />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <p className="text-gray-600">Contenu de la page Pneus</p>
        </div>
      </div>
    </div>
  );
};

export default PneusPage;
