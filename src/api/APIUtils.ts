import * as _ from "lodash";

const APIUtils = {
    getIncludedObject(object: any, included: any) {
        if (!object) {
            return null;
        }

        return _.find(included, (o) => {
            return o.id === object.id && o.type === object.type;
        });
    }
};

export { APIUtils };
