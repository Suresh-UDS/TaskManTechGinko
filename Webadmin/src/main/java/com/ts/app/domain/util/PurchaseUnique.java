package com.ts.app.domain.util;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.mortbay.log.Log;

public class PurchaseUnique implements IdentifierGenerator {
	@Override
	public Serializable generate(SessionImplementor session, Object object) throws HibernateException {

	    Connection connection = session.connection();
	    try {
	        Statement statement=connection.createStatement();

	        //ResultSet rs=statement.executeQuery("SELECT MAX(counted) FROM (SELECT COUNT(*) as counted FROM purchase_ref_gen) as counts");
	        ResultSet rs=statement.executeQuery("SELECT MAX(reference_number) FROM purchase_ref_gen");
            Log.debug("Generated unique string for purchase requisition -" + rs);

	        if(rs.next())
	        {
	            long id=rs.getInt(1) + 1;
	            long generatedId = id;
	            Log.debug("Generated unique string for purchase requisition -" + generatedId);
	            return generatedId;
	        }else {
	        	return 1000001;
	        }
	    } catch (SQLException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }

	    return null;
	}
}
