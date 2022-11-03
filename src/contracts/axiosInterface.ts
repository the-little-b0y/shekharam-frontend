interface ValidationError {
    location: string,
    msg: string,
    param: string,
    value: string
}

export interface ApiResponse {
    code: number,
    message: string,
    OK: boolean,
    errors?: ValidationError[]
}
