import * as jszip from 'jszip';
import * as jsPDF from 'jspdf';

import { YumpuDocumentPage } from "./YumpuDocumentPage";

export interface YumpuDocument {
    id: string;
    name: string;
    pages: YumpuDocumentPage[];    
    asPDF?: jsPDF;
    asZIP?: Blob;
}