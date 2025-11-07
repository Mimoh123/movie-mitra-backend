import { Router } from "express";
import AuthController from "../controller/AuthController";
import WatchListController from "../controller/WatchListController";
import { authenticate } from "../../middleware/authenticate";
import UserController from "../controller/UserController";


const router = Router()
router.post("/register", AuthController.register)
router.post("/login", AuthController.login)

router.post("/watchlist", authenticate, WatchListController.createWatchList)
router.get("/watchlist", authenticate, WatchListController.getWatchLists)
router.get("/watchlist/:id", authenticate, WatchListController.getWatchListById)
router.get("/watchlist/user/get", authenticate, WatchListController.getWatchListsByUserId)
router.put("/watchlist/:id", authenticate, WatchListController.updateWatchList)
router.delete("/watchlist/:id", authenticate, WatchListController.deleteWatchList)

router.get("/user", authenticate, UserController.getUserById)
router.get("/user/email", authenticate, UserController.getUserByEmail)
router.put("/user/:id", authenticate, UserController.updateUser)
router.delete("/user/:id", authenticate, UserController.deleteUser)
export default router