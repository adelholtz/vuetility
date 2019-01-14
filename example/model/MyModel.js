import BasicModel from '@src/BasicModel';
import _ from 'lodash';

export class MyModel{

    name(){
        return 'MyModel';
    }

    constructor(config = {}){
        _.merge(this, new BasicModel(config));
    }

    model(){
        return {
            'id': {
                type: Number
            },
            'live': {
                type: Boolean,
                defaultValue: false
            },
            'category': {
                type: String,
                computedType: 'select'
            },
            'type': {
                type: String,
                defaultValue: 'gtld',
                computedType: 'default', // can be omitted if 'default'
                //make sure type is always returned in lower case
                renderer(type){
                    return type.toLowerCase();
                }
            }
        };
    }

}
