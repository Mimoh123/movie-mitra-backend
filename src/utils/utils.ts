import bcrypt from "bcryptjs"


export const Password = {
 hash(password: string) {
  return bcrypt.hashSync(password, 10)
 },
 comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
 }
}