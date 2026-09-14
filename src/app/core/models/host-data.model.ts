export interface HostData {
  entityType: 'particular' | 'autonomo' | 'sociedad';
  fiscalName: string;
  documentType: 'NIF' | 'NIE' | 'CIF';
  documentNumber: string;
  huttbLicenseNumber: string;
  cadastralReference: string;    
  habitabilityCertificate: string;
  address: string;
  city: string;
  zipCode: number;
  tourismLicenseNumber?: string;
  bankAccount: string;
}
