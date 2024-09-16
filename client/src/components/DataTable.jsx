import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import axios from "axios";
import { Edit, ExternalLinkIcon, Save, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { showErrorToast, showSuccessToast } from "./ToastNotification";

const DataTable = ({ rows, columns, apiEndpoints, role }) => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [dataRows, setDataRows] = useState(rows);

  useEffect(() => {
    setDataRows(rows);
  }, [rows]);

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    const updatedRow = dataRows.find((row) => row.id === id);
  };

  const handleDeleteClick = (id) => async () => {
    try {
      const res = await axios.delete(`${apiEndpoints.delete}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success == true) {
        showSuccessToast("Row deleted successfully!");
        setDataRows(dataRows.filter((row) => row.id !== id));
      } else {
        showErrorToast("Row deleted failed");
      }
    } catch (error) {
      if (error.response) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast("An unexpected error occurred");
      }
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setDataRows(
      dataRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );

    await handleUpdateRowReq(updatedRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleUpdateRowReq = async (updatedRow) => {
    const { id, col2, col3 } = updatedRow;

    try {
      const res = await axios.put(
        `${apiEndpoints.update}/${id}`,
        { name: col2, email: col3 },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        showSuccessToast("Row updated successfully!");
      } else {
        showErrorToast("Failed to update row");
      }
    } catch (error) {
      if (error.response) {
        showErrorToast(error.response.data.message);
      } else if (error.request) {
        showErrorToast("No response from the server");
      } else {
        showErrorToast("An unexpected error occurred");
      }
    }
  };

  const actionColumn = {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 200,
    getActions: ({ id }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<Save />}
            label="Save"
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<ExternalLinkIcon />}
            label="Cancel"
            onClick={handleCancelClick(id)}
          />,
        ];
      }
      return [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={handleEditClick(id)}
        />,
        <GridActionsCellItem
          icon={<Trash2 />}
          label="Delete"
          onClick={handleDeleteClick(id)}
        />,
      ];
    },
  };

  return (
    <DataGrid
      rows={rows}
      columns={[...columns, ...(role == "ADMIN" ? [actionColumn] : [] ) ]}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={(error) =>
        showErrorToast("Failed to update row")
      }
    />
  );
};

export default DataTable;
