import { ApiResponse } from "./axiosInterface"

export interface CollectionItemTypeInterface {
    itemtype: string,
    itemimage: string,
    _id?: string
}

export interface GetConfigurationInterface {
    collectionItemTypes: CollectionItemTypeInterface[]
}

export interface GetConfigurationReturnInterface extends ApiResponse {
    data: GetConfigurationInterface
}
