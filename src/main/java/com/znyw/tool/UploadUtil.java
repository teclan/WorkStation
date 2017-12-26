package com.znyw.tool;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;



public class UploadUtil {
	private static PropertyConfigUtil propertyConfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");
	
	public static String Upload(MultipartFile file) {
		boolean result = false;
		//String strFileType = file.getContentType();
		String strNewFileName = UUID.randomUUID().toString();
		String strOldFileName = file.getOriginalFilename();

		String[] strArr = strOldFileName.split("\\.");
		if (strArr.length > 1)
			strNewFileName += ("." + strArr[strArr.length - 1]);
		String storePath = propertyConfigUtil.getValue("imageSrv.storePath");
		//String storePath = "G:\\uploadProject\\";
		storePath = FileTool.GetDatePath(storePath);			//按日期创建文件夹
		if(!FileTool.CreateDirectory(storePath)){		//创建文件夹
			result = false;
		}
		String path = storePath + strNewFileName;
		
		
		System.out.println("path："+path);
		try {
			result = SaveFileFromInputStream(file.getInputStream(), path);
		} catch (IOException e) {
			e.printStackTrace();
			result = false;
		}
		if(result){
			String pre = propertyConfigUtil.getValue("imageSrv.url");
			path = path.replace("\\", "\\\\");
			return pre + path;
		}else{
			return "";
		}
		
	
	}
	
	public static boolean SaveFileFromInputStream(InputStream stream, String path) {
		try {
			FileOutputStream fs = new FileOutputStream(path);
			byte[] buffer = new byte[1024 * 1024];
			int byteread = 0;
			while ((byteread = stream.read(buffer)) != -1) {
				fs.write(buffer, 0, byteread);
				fs.flush();
			}
			fs.close();
			stream.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	//删除文件
	public static boolean delFile(String path) {
		try {
			File f = new File(path);  // 输入要删除的文件位置
			if(f.exists()){
				f.delete();
			} 
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		} 
		return true;
	}
}
