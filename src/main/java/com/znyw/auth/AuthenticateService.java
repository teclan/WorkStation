package com.znyw.auth;

import java.security.MessageDigest;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service
public class AuthenticateService {
	private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticateService.class);

	@Resource
	private JdbcTemplate jdbcTemplate;

	public boolean authenticate(String userName, String token) {

		// String sql = "select userName,token from ws_users where userName=?";
		// try {
		//
		// List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql, userName);
		//
		// if(Objects.isNull(lists)|| lists.get(0).get("token")==null) {
		// return false;
		// }
		// String realToken = lists.get(0).get("token").toString();
		//
		// LOGGER.info("userName:{},expect token:{},actully token :{}", userName, token,
		// realToken);
		//
		// return realToken.equals(token);
		// } catch (Exception e) {
		// LOGGER.error(e.getMessage(), e);
		// return false;
		// }

		return true;
	}

	@SuppressWarnings("deprecation")
	public JSONObject login(String userName, String password) {
		String sql = "select count(*) from ws_users where userName=? and password=? ";
		try {
			int count = jdbcTemplate.queryForInt(sql, userName, password);

			if (count > 0) {
				String token = generateToken(userName);
				sql = "update ws_users set token=? where userName=? and password=? ";
				jdbcTemplate.update(sql, token, userName, password);
				return ResultUtil.login("200", "登录成功", userName, token);
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return ResultUtil.simpleResponse("401", "认证失败");
	}

	public JSONObject logout(String userName, String token) {
		String sql = "update ws_users set token=? where userName=? and token=?";
		try {
			jdbcTemplate.update(sql, null, userName, token);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return ResultUtil.simpleResponse("200", "退出成功");
	}

	public JSONObject changePwd(String userName, String oldPwd, String newPwd) {

		String sql = "select userName,password from ws_users where userName=?";

		try {
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql, userName);

			if (Objects.isNull(lists)) {
				return ResultUtil.simpleResponse("500", "用户不存在，修改失败");
			}

			String pwd = lists.get(0).get("password").toString();

			if (!pwd.equals(oldPwd)) {
				return ResultUtil.simpleResponse("500", "旧密码错误");
			}

			sql = "update ws_users set password=? where userName=?";

			jdbcTemplate.update(sql, newPwd, userName);

			return ResultUtil.simpleResponse("200", "修改成功");

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "数据库错误");
		}


	}


	private String generateToken(String userName) {
		 String       md5str="";
			    try {  
			        MessageDigest md = MessageDigest.getInstance("MD5");  
			  
			        byte[] input = (userName+new Date().getTime()).getBytes();  
			  
			        byte[] buff = md.digest(input);  
			  
			        md5str = bytesToHex(buff);  
			  
			    } catch (Exception e) {  
			        e.printStackTrace();  
			    }  
			    return md5str;  

	}

	private String bytesToHex(byte[] bytes) {
		StringBuffer md5str = new StringBuffer();
		int digital;
		for (int i = 0; i < bytes.length; i++) {
			digital = bytes[i];

			if (digital < 0) {
				digital += 256;
			}
			if (digital < 16) {
				md5str.append("0");
			}
			md5str.append(Integer.toHexString(digital));
		}
		return md5str.toString().toUpperCase();
    }

}
