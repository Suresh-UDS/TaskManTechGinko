package com.ts.app.domain;

/**
 * Created by karth on 7/1/2017.
 */
public enum AssetType {
    HOUSEKEEPING(1),
    ELECTRICAL(2),
    AC(3),
    CARPENTRY(4),
    PESTCONTROL(5),
    PLUMBING(6);

    private int value;

    private AssetType(int val){
        value = val;
    }
}
