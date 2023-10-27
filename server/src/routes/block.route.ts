/**
 * Specifies the middleware and controller functions to call for each route
 * relating to blocks.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isExist } from '../controllers/block.middleware';
import {
  getBlockInfo,
  getBlockInfoById,
  putAddBlock,
  putEditBlock,
} from '../controllers/block.controller';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get block information from its id.
 */
router.get('/block-info-id/:id', isAuthenticated, isAdmin, getBlockInfoById);

/**
 * A GET route to get student coach pairs for a given block. Checks first if the requestor is
 * authenticated and is an admin.
 * Expects a JSON body with the following fields:
 * - id (string) - block id
 */
router.get('/block-info', isAuthenticated, isAdmin, getBlockInfo);

/**
 * A PUT route to add/edit a block if it already exists. Checks first if the requestor
 * is authenticated and is an admin.
 * Expects a JSON body with the following fields:
 * - day: string;
 *	- start_time: string;
 *	- end_time: string;
 *	- block: int;
 *	- zoom: string;
 *	- students: string[];
 */
router.put('/add-block', isAuthenticated, isAdmin, isExist, putAddBlock);

router.put('/edit-block', isAuthenticated, isAdmin, putEditBlock);

export default router;
