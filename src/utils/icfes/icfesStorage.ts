import { IcfesDataset } from "@/src/shared/types/icfes.types";

// Storage key
const ICFES_STORAGE_KEY = "edumetricks_icfes_datasets";

// Get dataset
export function getIcfesDatasets(): Record<
  string,
  IcfesDataset
> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawStorage = localStorage.getItem(
      ICFES_STORAGE_KEY,
    );

    if (!rawStorage) {
      return {};
    }

    return JSON.parse(rawStorage);
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_GET_ERROR]",
      error,
    );

    return {};
  }
}

// Guardar toda la data
export function saveIcfesDatasets(
  datasets: Record<string, IcfesDataset>,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      ICFES_STORAGE_KEY,
      JSON.stringify(datasets),
    );
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_SAVE_ALL_ERROR]",
      error,
    );
  }
}

// Guardar toda la dataset
export function saveIcfesDataset(
  dataset: IcfesDataset,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const currentDatasets = getIcfesDatasets();

    currentDatasets[dataset.id] = dataset;

    saveIcfesDatasets(currentDatasets);
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_SAVE_ERROR]",
      error,
    );
  }
}

// Obtener el id de la dataset
export function getIcfesDatasetById(
  id: string,
): IcfesDataset | null {
  try {
    const datasets = getIcfesDatasets();

    return datasets[id] ?? null;
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_GET_BY_ID_ERROR]",
      error,
    );

    return null;
  }
}

// Obetener la dataset del año
export function getIcfesDatasetByYear(
  year: number,
): IcfesDataset | null {
  try {
    const datasets = Object.values(
      getIcfesDatasets(),
    );

    return (
      datasets.find(
        (dataset) => dataset.year === year,
      ) ?? null
    );
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_GET_BY_YEAR_ERROR]",
      error,
    );

    return null;
  }
}

// Eliminar la dataset
export function removeIcfesDataset(
  id: string,
) {
  try {
    const datasets = getIcfesDatasets();

    delete datasets[id];

    saveIcfesDatasets(datasets);
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_REMOVE_ERROR]",
      error,
    );
  }
}

// Limpiar el storage
export function clearIcfesStorage() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(ICFES_STORAGE_KEY);
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_CLEAR_ERROR]",
      error,
    );
  }
}

// check data
export function hasIcfesData(): boolean {
  try {
    const datasets = getIcfesDatasets();

    return Object.keys(datasets).length > 0;
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_HAS_DATA_ERROR]",
      error,
    );

    return false;
  }
}

// Obtener la ultima data
export function getLatestIcfesDataset(): IcfesDataset | null {
  try {
    const datasets = Object.values(
      getIcfesDatasets(),
    );

    if (!datasets.length) {
      return null;
    }

    return datasets.sort(
      (a, b) => b.year - a.year,
    )[0];
  } catch (error) {
    console.error(
      "[ICFES_STORAGE_LATEST_ERROR]",
      error,
    );

    return null;
  }
}