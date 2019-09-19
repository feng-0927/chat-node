/*
 Navicat Premium Data Transfer

 Source Server         : h1902
 Source Server Type    : MySQL
 Source Server Version : 50553
 Source Host           : localhost:3306
 Source Schema         : chat

 Target Server Type    : MySQL
 Target Server Version : 50553
 File Encoding         : 65001

 Date: 11/09/2019 04:01:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for pre_addfriend
-- ----------------------------
DROP TABLE IF EXISTS `pre_addfriend`;
CREATE TABLE `pre_addfriend`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '内容',
  `fromids` int(11) UNSIGNED NULL DEFAULT NULL COMMENT '接收人id',
  `toids` int(11) UNSIGNED NULL DEFAULT NULL COMMENT '发送人id',
  `groupid` int(11) UNSIGNED NULL DEFAULT NULL COMMENT '分组id',
  `createtime` int(11) UNSIGNED NULL DEFAULT NULL COMMENT '发送时间',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '0未操作 1拒绝 2同意',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `keychat_fromids`(`fromids`) USING BTREE,
  INDEX `keychat_toids`(`toids`) USING BTREE,
  INDEX `keychat_groupid`(`groupid`) USING BTREE,
  CONSTRAINT `forignchat_fromids` FOREIGN KEY (`fromids`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `forignchat_group` FOREIGN KEY (`groupid`) REFERENCES `pre_user_group` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `forignchat_toids` FOREIGN KEY (`toids`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '加好友表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pre_addfriend
-- ----------------------------
INSERT INTO `pre_addfriend` VALUES (13, '你好！我是hao', 2, 9, 14, 1568142599, '1');
INSERT INTO `pre_addfriend` VALUES (14, '你好！我是hao', 2, 9, 14, 1568142617, '1');
INSERT INTO `pre_addfriend` VALUES (15, '你好！我是hao', 2, 9, 14, 1568142653, '1');
INSERT INTO `pre_addfriend` VALUES (16, '你好！我是hao', 2, 9, 14, 1568142689, '1');
INSERT INTO `pre_addfriend` VALUES (17, '你好！我是hao', 2, 9, 14, 1568142689, '1');

-- ----------------------------
-- Table structure for pre_chat
-- ----------------------------
DROP TABLE IF EXISTS `pre_chat`;
CREATE TABLE `pre_chat`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '聊天内容',
  `createtime` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '发送时间',
  `fromid` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '接收人id',
  `toid` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '发送人id',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '0未读 1已读',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `keychat_fromid`(`fromid`) USING BTREE,
  INDEX `keychat_toid`(`toid`) USING BTREE,
  CONSTRAINT `forignchat_fromid` FOREIGN KEY (`fromid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `forignchat_toid` FOREIGN KEY (`toid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '聊天记录表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pre_chat
-- ----------------------------
INSERT INTO `pre_chat` VALUES (21, 'ugyx', 1567510069, 2, 8, '0');
INSERT INTO `pre_chat` VALUES (22, 'jhg', 1567510072, 2, 8, '0');
INSERT INTO `pre_chat` VALUES (23, 'ojhgf', 1567510076, 2, 8, '0');
INSERT INTO `pre_chat` VALUES (24, '山东干豆腐', 1567513654, 8, 2, '0');
INSERT INTO `pre_chat` VALUES (25, '对方过后', 1567513678, 8, 2, '0');
INSERT INTO `pre_chat` VALUES (26, '让他', 1567513683, 8, 2, '0');
INSERT INTO `pre_chat` VALUES (27, 'asdf', 1567513921, 2, 8, '0');
INSERT INTO `pre_chat` VALUES (28, 'sgrdtr', 1567514053, 2, 8, '0');

-- ----------------------------
-- Table structure for pre_comment
-- ----------------------------
DROP TABLE IF EXISTS `pre_comment`;
CREATE TABLE `pre_comment`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `postid` int(11) UNSIGNED NOT NULL COMMENT '帖子外键id',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论内容',
  `create_time` int(11) UNSIGNED NOT NULL COMMENT '评论时间',
  `userid` int(11) UNSIGNED NOT NULL COMMENT '评论用户id',
  `parentid` int(11) UNSIGNED NOT NULL COMMENT '父级id',
  `deep` int(11) UNSIGNED NOT NULL COMMENT '层级id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `postid`(`postid`) USING BTREE,
  INDEX `userid`(`userid`) USING BTREE,
  CONSTRAINT `foreign_comment_postid` FOREIGN KEY (`postid`) REFERENCES `pre_post` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `foreign_comment_userid` FOREIGN KEY (`userid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 193 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '评论表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pre_comment
-- ----------------------------
INSERT INTO `pre_comment` VALUES (169, 17, 'fah', 1568145193, 2, 0, 0);
INSERT INTO `pre_comment` VALUES (170, 17, 'jafs', 1568145195, 2, 0, 0);
INSERT INTO `pre_comment` VALUES (171, 17, 'asdf', 1568145200, 2, 0, 1);
INSERT INTO `pre_comment` VALUES (172, 17, 'fas', 1568145203, 2, 0, 1);
INSERT INTO `pre_comment` VALUES (173, 17, 'afsdf', 1568145215, 9, 0, 0);
INSERT INTO `pre_comment` VALUES (174, 17, 'afsd', 1568145220, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (175, 17, 'afsd', 1568145221, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (176, 17, 'afsd', 1568145223, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (177, 17, 'afsdafd', 1568145225, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (178, 17, 'afsdafd', 1568145225, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (179, 17, 'afsdafd', 1568145225, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (180, 17, 'afsdafd', 1568145226, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (181, 17, 'afds', 1568145342, 2, 172, 2);
INSERT INTO `pre_comment` VALUES (182, 17, 'afhds', 1568145361, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (183, 17, 'adfs', 1568145366, 9, 172, 2);
INSERT INTO `pre_comment` VALUES (184, 17, 'asdf', 1568145375, 9, 173, 1);
INSERT INTO `pre_comment` VALUES (185, 17, 'afdsfdaf', 1568145380, 9, 173, 1);
INSERT INTO `pre_comment` VALUES (186, 17, '阿纲', 1568145384, 9, 173, 1);
INSERT INTO `pre_comment` VALUES (187, 17, 'dsaffff', 1568145396, 9, 173, 1);
INSERT INTO `pre_comment` VALUES (188, 17, 'fdsa', 1568145401, 9, 172, 3);
INSERT INTO `pre_comment` VALUES (189, 17, 'fsdaf', 1568145404, 9, 172, 3);
INSERT INTO `pre_comment` VALUES (190, 17, 'adsf', 1568145409, 9, 172, 3);
INSERT INTO `pre_comment` VALUES (191, 17, 'asfdh', 1568145414, 9, 172, 3);
INSERT INTO `pre_comment` VALUES (192, 17, 'erger', 1568145417, 9, 172, 3);

-- ----------------------------
-- Table structure for pre_post
-- ----------------------------
DROP TABLE IF EXISTS `pre_post`;
CREATE TABLE `pre_post`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `userid` int(11) UNSIGNED NOT NULL COMMENT '用户id',
  `create_time` int(11) NOT NULL COMMENT '发表时间',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '内容',
  `pics` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '图集',
  `thumbup` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '点赞',
  `count` int(11) NOT NULL COMMENT '浏览次数',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userid`(`userid`) USING BTREE,
  CONSTRAINT `foreign_post_userid` FOREIGN KEY (`userid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '帖子表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pre_post
-- ----------------------------
INSERT INTO `pre_post` VALUES (1, 3, 1567749799, '说点什么吧...', '/uploads/ZjY7MDtzzwCnsQntcWbIUx3B.jpg', '0', 10);
INSERT INTO `pre_post` VALUES (2, 3, 1567749996, '今天在路边捡到5分钱，很开心', '/uploads/hswTwBq-WNB4Jvb0aDqZ2aFN.jpg', '2', 10);
INSERT INTO `pre_post` VALUES (5, 3, 1567750689, '说点什么吧...', '/uploads/i8LKZyWCRJ4SRPaCI4SDa9Vb.jpg,/uploads/fYQj9KdTo2fd77zWayiyArGI.jpg,/uploads/JMQr7f5L4Md1ovX3_D10XvFB.jpg,/uploads/lyV6MV8WTMrEtlXNUmGDqHIc.jpg', '3,1,2', 10);
INSERT INTO `pre_post` VALUES (6, 3, 1567750754, '今天扶老奶奶过马路，然后被碰瓷了？', '', '3,1,2', 10);
INSERT INTO `pre_post` VALUES (7, 1, 1567771361, '今天扶老奶奶过马路，然后被碰瓷了？', '', '3', 19);
INSERT INTO `pre_post` VALUES (15, 1, 1567848918, '说点什么吧...', '/uploads/qCuTVctrHHlzd6k54Nk6jSp9.jpg', '1,2', 19);
INSERT INTO `pre_post` VALUES (16, 2, 1567919854, '我是兔子', '/uploads/D7s824VAVid3d9eLeWKtmHgx.jpg', '1,2', 27);
INSERT INTO `pre_post` VALUES (17, 9, 1568145139, '我是兔子', '/uploads/D7s824VAVid3d9eLeWKtmHgx.jpg', '9,2', 27);
INSERT INTO `pre_post` VALUES (18, 9, 1568145594, 'afds', '/uploads/22djDyRqu4KIOGTv5cRWshKz.png,/uploads/3XMdkcGIa2Tvtod7HdmE4-oj.png,/uploads/91k-CV1jnTiUjN1V-vLln5IJ.png,/uploads/fChysYx1ZgSx3M4IxO4JgI_a.png,/uploads/KXGZ2n305dw9yrWy0738eZ6h.png', '0', 4);

-- ----------------------------
-- Table structure for pre_setting
-- ----------------------------
DROP TABLE IF EXISTS `pre_setting`;
CREATE TABLE `pre_setting`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `value` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '网站设置表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pre_setting
-- ----------------------------
INSERT INTO `pre_setting` VALUES (1, 'logo', '网站Logo', 'public/logo.jpg');
INSERT INTO `pre_setting` VALUES (2, 'flags', '热门标签', '[{ \"name\": \"hot\",\"value\": \"热门\"},{\"name\": \"new\",\"value\": \"最新\"}, {\"name\": \"top\",\"value\": \"置顶\" } ]');
INSERT INTO `pre_setting` VALUES (3, 'webname', '网站名称', '爱聊天网');
INSERT INTO `pre_setting` VALUES (4, 'copyright', '网站版权', 'Copyright @ baidu.com');

-- ----------------------------
-- Table structure for pre_user
-- ----------------------------
DROP TABLE IF EXISTS `pre_user`;
CREATE TABLE `pre_user`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `password` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `salt` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码盐',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `createtime` int(11) NULL DEFAULT NULL COMMENT '注册时间',
  `status` int(11) NULL DEFAULT 0 COMMENT '0邮箱未验证，1邮箱已验证',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pre_user
-- ----------------------------
INSERT INTO `pre_user` VALUES (1, 'demo', 'd84b346696530378a9851c6ad24ed678', 'bNYcjGrJsA8n6tpYnhFd', '/uploads/z4nCr2qzb9Dvna0PI0sWx5nK.jpg', '2925712507@qq.com', 1567044588, 1);
INSERT INTO `pre_user` VALUES (2, 'admin', '3d34a184bd275aa8f37ca9df2e29139c', 'DYPMJ8TBYmfaGGdAi4Cs', '/uploads/z4nCr2qzb9Dvna0PI0sWx5nK.jpg', '1505833324@qq.com', 1567234865, 1);
INSERT INTO `pre_user` VALUES (3, '写得多', 'd84b346696530378a9851c6ad24ed678', 'bNYcjGrJsA8n6tpYnhFd', '/uploads/z4nCr2qzb9Dvna0PI0sWx5nK.jpg', '2925712507@qq.com', 1567044588, 1);
INSERT INTO `pre_user` VALUES (4, '的demo', 'd84b346696530378a9851c6ad24ed678', 'bNYcjGrJsA8n6tpYnhFd', '/uploads/z4nCr2qzb9Dvna0PI0sWx5nK.jpg', '2925712507@qq.com', 1567044588, 1);
INSERT INTO `pre_user` VALUES (8, 'home', '395985f69da4427a165214a335d2073e', 'ph6jw2zwBppykQSHDzy7', NULL, NULL, 1567495569, 1);
INSERT INTO `pre_user` VALUES (9, 'hao', '395985f69da4427a165214a335d2073e', 'ph6jw2zwBppykQSHDzy7', '/uploads/z4nCr2qzb9Dvna0PI0sWx5nK.jpg', '2925712507@qq.com', 1567495569, 1);

-- ----------------------------
-- Table structure for pre_user_friends
-- ----------------------------
DROP TABLE IF EXISTS `pre_user_friends`;
CREATE TABLE `pre_user_friends`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `friend` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '好友id',
  `userid` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '所属用户id',
  `groupid` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '所属的分组',
  `createtime` int(11) NULL DEFAULT 0 COMMENT '添加时间',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '验证信息',
  `status` int(255) NULL DEFAULT NULL COMMENT '0未通过 1已通过 2已拒绝',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `keyfriends_groupid`(`groupid`) USING BTREE,
  CONSTRAINT `forignfriends_groupid` FOREIGN KEY (`groupid`) REFERENCES `pre_user_group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '好友表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pre_user_friends
-- ----------------------------
INSERT INTO `pre_user_friends` VALUES (1, 1, 2, 10, 1567234865, '发哈', 1);
INSERT INTO `pre_user_friends` VALUES (7, 4, 2, 11, 1567234865, '发哈', 1);
INSERT INTO `pre_user_friends` VALUES (8, 3, 2, 12, 1567234865, '发哈', 1);
INSERT INTO `pre_user_friends` VALUES (9, 8, 2, 10, 1567234865, 'fed', 1);
INSERT INTO `pre_user_friends` VALUES (27, 9, 2, 10, 1568142729, NULL, 1);
INSERT INTO `pre_user_friends` VALUES (28, 2, 9, 14, 1568142729, NULL, 1);

-- ----------------------------
-- Table structure for pre_user_group
-- ----------------------------
DROP TABLE IF EXISTS `pre_user_group`;
CREATE TABLE `pre_user_group`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '分组名称',
  `userid` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '所属用户',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `keygroup_userid`(`userid`) USING BTREE,
  CONSTRAINT `forigngroup_userid` FOREIGN KEY (`userid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '分组表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pre_user_group
-- ----------------------------
INSERT INTO `pre_user_group` VALUES (1, '朋友', 1);
INSERT INTO `pre_user_group` VALUES (3, '同学', 1);
INSERT INTO `pre_user_group` VALUES (10, '家人', 2);
INSERT INTO `pre_user_group` VALUES (11, '同学', 2);
INSERT INTO `pre_user_group` VALUES (12, '朋友', 2);
INSERT INTO `pre_user_group` VALUES (13, '家人', 8);
INSERT INTO `pre_user_group` VALUES (14, '家人', 9);

SET FOREIGN_KEY_CHECKS = 1;
