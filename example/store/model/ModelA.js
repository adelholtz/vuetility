export class LoginModel {
    model() {
        return {
            'username': {
                type: String,
                defaultValue: undefined
            },
            'password': {
                type: String,
                defaultValue: 'n/a'
            }
        };
    }
}
