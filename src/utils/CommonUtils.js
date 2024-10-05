import { error } from "jquery";
import { reject } from "lodash";

class CommonUtils {
    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(error);
        });
    }
}

export default CommonUtils;