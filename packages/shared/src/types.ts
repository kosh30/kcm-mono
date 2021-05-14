export type Book = {
  classDescs: string[];
  fileName: string;
  fileSize: string;
  itemCount: string;
  runDate: string;
};

export type Item = {
  custNbr: string;
  runDate: string;
  effDate: string;
  zone: string;
  prodCode: string;
  brand: string;
  description: string;
  pack: string;
  size: string;
  cusPrd: string;
  poaIdent: string;
  itemCode: string;
  restrictPfInd: string;
  dealPackInd: string;
  cripPoa: string;
  slowMover: string;
  fullCaseInd: string;
  dsdInd: string;
  thirteenWk: string;
  akaType: string;
  upc: string;
  allow: string;
  allowInd: string;
  allowEndDate: string;
  cost: string;
  costInd: string;
  netCost: string;
  unitCost: string;
  netUnitCost: string;
  zoneNbr: string;
  baseZoneMult: string;
  baseZoneSrp: string;
  baseZoneInd: string;
  baseZonePct: string;
  baseZonePctInd: string;
  rdcdZoneMult: string;
  rdcdZoneSrp: string;
  rdcdZoneInd: string;
  rdcdZonePct: string;
  rdcdZonePctInd: string;
  baseCripMult: string;
  baseCripSrp: string;
  baseCripSrpInd: string;
  baseCripPct: string;
  baseCripPctInd: string;
  rdcdCripMult: string;
  rdcdCripSrp: string;
  rdcdCripSrpInd: string;
  rdcdCripPct: string;
  rdcdCripPctInd: string;
  rdcdSrpInd: string;
  endDate: string;
  palletQty: string;
  itemAuth: string;
  itemStatus: string;
  categoryClass: string;
  categoryClassDescription: string;
  classId: string;
  classDesc: string;
  subClassId: string;
  subClassDescription: string;
  varietyId: string;
  varietyDesc: string;
};

export type Set = {
  aisle: string;
  createdAt: string;
  createdBy: string;
  items: Item[][];
  length: string;
  name: string;
  notes: string;
  store: string;
  updatedAt: string;
  version: string;
};

export const newSet = (): Set => ({
  aisle: "",
  createdAt: "",
  createdBy: "",
  length: "",
  items: [[]],
  name: "",
  notes: "",
  store: "",
  updatedAt: "",
  version: "",
});
