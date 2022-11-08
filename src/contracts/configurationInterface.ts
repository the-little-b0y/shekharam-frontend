import { ApiResponse } from "./axiosInterface"

export interface CollectionItemTypeInterface {
    itemtype: string,
    itemimage: string,
    _id?: string
}

export interface ConditionTypeInterface {
    conditiontype: string,
    _id?: string
}

export interface GetConfigurationInterface {
    collectionItemTypes: CollectionItemTypeInterface[],
    conditionTypes: ConditionTypeInterface[],
    currency: string
}

export interface GetConfigurationReturnInterface extends ApiResponse {
    data: GetConfigurationInterface
}

export interface CurrencyInterface {
    code: string;
    expansion: string;
    symbol: string;
}
