import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.swing.filechooser.FileSystemView;

public class Main2 {
	public static void main(String[] args) throws IOException {
		//FileSystemView fsv = FileSystemView.getFileSystemView();
    	//File com=fsv.getHomeDirectory();
    	//File file = new File("C:/Program Files/Google/Chrome/Application/chrome.exe"); 
        //String path = getLnkFile(file);
		
    	List<String> cmd = new ArrayList<String>();
    	cmd.add("C:/Program Files/Google/Chrome/Application/chrome.exe");
    	cmd.add("--allow-file-access-from-files");
    	String filepath=System.getProperty("user.dir");
    	filepath = filepath + "\\emails.json";
    	String filePath = "file:///";
    	filePath = filePath + filepath;
    	cmd.add(filePath);
    	ProcessBuilder process = new ProcessBuilder(cmd);
    	try {
			process.start();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
	
	public static String getExt(String nameOrPath){
		String[] exts = nameOrPath.split("\\.");
		String ext = exts[exts.length - 1];

		Pattern pattern = Pattern.compile("[0-9a-zA-Z]{1,20}");
		Matcher matcher = pattern.matcher(ext);
		if(!matcher.matches())
		{
			return "";
		}
	
		return ext;
	}

	
	public static String getLnkFile(File lnkFile) {
	   RandomAccessFile r = null;
	   ByteArrayOutputStream bos = null;
	   String filename = null;
	   try {
	       r = new RandomAccessFile(lnkFile, "r");
	       byte[] bys = new byte[4];          

	       r.seek(0x4c);            
	       r.read(bys, 0, 2);
	       int offset = bytes2Int(bys, 0, 2);

	       int fileLocationInfoSagement = offset + 0x4e;
	
	       int filePathInfoSagement = fileLocationInfoSagement + 0x10;
	
	       r.seek(filePathInfoSagement);
	
	       r.read(bys, 0, 4);            
	       int filePathInfoOffset = fileLocationInfoSagement + bytes2Int(bys, 0, 4);
	
	       r.seek(filePathInfoOffset);
	       bos = new ByteArrayOutputStream();
	       for(byte b = 0; (b = r.readByte()) != 0;) {
	           bos.write(b);
	       }
	       bys = bos.toByteArray();
	       filename = new String(bys);            
	   } catch (IOException e) {
	       e.printStackTrace();
	   } finally {
	       if(bos != null) {
	           try {
	               bos.close();
	           } catch (IOException e) {
	               e.printStackTrace();
	           }
	       }
	       if(r != null) {
	           try {
	               r.close();
	           } catch (IOException e) {
	               e.printStackTrace();
	           }
	       }
	   }
	   return filename;
	}
	
	public static int bytes2Int(byte[] bys, int start, int len) {
		   int n = 0;
		   for(int i = start, k = start + len % 5; i < k; i++) {
		       n += (bys[i] & 0xff) << (i * 8);
		   }
		   return n;
		}

}
