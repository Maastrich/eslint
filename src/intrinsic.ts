import GetIntrinsic from "get-intrinsic";

const mypluginIntrinsics = new Set([
  "%Buffer%from%",
  "%Buffer%of%",
  "%Buffer%alloc%",
  "%Buffer%allocUnsafe%",
  "%Buffer%allocUnsafeSlow%",
  "%Buffer%isBuffer%",
  "%Buffer%compare%",
  "%Buffer%isEncoding%",
  "%Buffer%concat%",
  "%Buffer%byteLength%",
  "%PropTypes%array%",
  "%PropTypes%bool%",
  "%PropTypes%func%",
  "%PropTypes%number%",
  "%PropTypes%object%",
  "%PropTypes%string%",
  "%PropTypes%symbol%",
  "%PropTypes%any%",
  "%PropTypes%arrayOf%",
  "%PropTypes%element%",
  "%PropTypes%elementType%",
  "%PropTypes%instanceOf%",
  "%PropTypes%node%",
  "%PropTypes%objectOf%",
  "%PropTypes%oneOf%",
  "%PropTypes%oneOfType%",
  "%PropTypes%shape%",
  "%PropTypes%exact%",
  "%PropTypes%checkPropTypes%",
  "%PropTypes%resetWarningCache%",
  "%URL%createObjectURL%",
  "%URL%revokeObjectURL%",
]);

type IsIntrisicArgs = { objectName: string, propertyName: string }

export function isIntrisic({ objectName, propertyName }: IsIntrisicArgs) {
  const key = `%${objectName}%${propertyName}%`;
  if (mypluginIntrinsics.has(key)) {
    return true;
  }
  try {
    GetIntrinsic(key);
    return true;
  } catch (e) {
    return false;
  }
};
