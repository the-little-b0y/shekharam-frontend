import { ApiResponse } from "./axiosInterface";

export interface CountryInterface {
    code: string;
    name: string;
}

export interface CollectionInterface {
    _id?: string,
    collectionof: string,
    itemName: string,
    color: string,
    year: string,
    uniqueFeature: string,
    collectionSetQrcode: string,
    country: string,
    copies: CollectionCopyInterface[]
}

export interface CollectionCopyInterface {
    id?: string,
    copyqrcode: string,
    condition: string,
    purchaseprice: string,
    marketprice: string,
    remarks: string,
    collectedfrom: string,
    collectedon: Date | null
}

export interface GetCollectionReturnInterface extends ApiResponse {
    data: CollectionInterface[]
}

export interface GetSingleCollectionReturnInterface extends ApiResponse {
    data: CollectionInterface
}
