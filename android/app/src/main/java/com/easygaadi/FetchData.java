package com.easygaadi;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.telephony.TelephonyManager;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class FetchData extends ReactContextBaseJavaModule {
    private static final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 10;
    private static final long MIN_TIME_BW_UPDATES = 1000 * 60 * 1;
    public double Latitude = 0.0;
    public double Longitude = 0.0;
    public Context context;

    public FetchData(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "FetchData";
    }

    @ReactMethod
    public void GetDeviceId(Callback prom) {
        prom.invoke(FetchDeviceId());
    }
    @ReactMethod
    public void GetImg(String s,Callback prom){prom.invoke(FetchImg(s));}
    @ReactMethod
    public void GetLoc(Callback prom) {
        prom.invoke(FetchLoc());
    }

        LocationListener locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
//            Longitude = location.getLongitude();
//            Latitude = location.getLatitude();
            }

            public void onStatusChanged(String provider, int status, Bundle extras) {
            }

            public void onProviderEnabled(String provider) {
            }

            public void onProviderDisabled(String provider) {
            }
        };

    private String FetchLoc() {
        try {
            LocationManager locationManager;
            Activity context = getReactApplicationContext().getCurrentActivity();
            LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
            if (!lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                return "Please switch on location";
            } else {
                lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, MIN_DISTANCE_CHANGE_FOR_UPDATES, MIN_TIME_BW_UPDATES, locationListener);
                if (lm != null) {
                    Location location = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                    if (location == null) {
                        location = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                    }
                    if (location == null) {
                        FetchLoc();
                        return null;
                    } else {
                        Latitude = location.getLatitude();
                        Longitude = location.getLongitude();
                        return Longitude + "#$#" + Latitude;
                    }
                } else {
                    return "Could not retrieve your location, change location to high availability mode";
                }
            }
        } catch (Exception e) {
            return "Could not retrieve your location, change location to high availability mode";
        }
    }

    public String FetchImg(String path){
        String resp = null;
//        InputStream inputStream = new FileInputStream(path);//You can get an inputStream using any IO API
//        byte[] bytes;
//        byte[] buffer = new byte[8192];
//        int bytesRead;
//        ByteArrayOutputStream output = new ByteArrayOutputStream();
//        try {
//            while ((bytesRead = inputStream.read(buffer)) != -1) {
//                output.write(buffer, 0, bytesRead);
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        bytes = output.toByteArray();
//        String encodedString = Base64.encodeToString(bytes, Base64.DEFAULT);
//        return encodedString;
        try {
            Bitmap image = MediaStore.Images.Media.getBitmap(this.getReactApplicationContext().getContentResolver(), Uri.parse(path));
            if (image == null) {
                resp= "Failed to decode Bitmap, uri: " + path;
            } else {
                resp= bitmapToBase64(image);
            }
        } catch (IOException e) {
        }
    return resp;
    }
    private String bitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.DEFAULT);
    }

    public String FetchDeviceId(){
        context = getReactApplicationContext().getCurrentActivity();
        TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);


        Log.v("riyaz","-->"+tm.getDeviceId());
        //PHONE_TYPE_CDMA = 2; PHONE_TYPE_GSM = 1;
            return tm.getDeviceId();

    }
}
