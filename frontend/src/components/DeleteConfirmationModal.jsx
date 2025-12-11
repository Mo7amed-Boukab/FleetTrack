import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, itemType = "élément" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-700" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-900">{itemName}</span> ?
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Cette action est irréversible et toutes les données associées à {itemType} seront définitivement perdues.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 pt-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-all"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-red-700 rounded hover:bg-red-800 transition-all"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
