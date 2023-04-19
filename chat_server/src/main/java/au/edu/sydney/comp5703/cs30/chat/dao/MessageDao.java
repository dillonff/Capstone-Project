package au.edu.sydney.comp5703.cs30.chat.dao;

import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

@Repository
public class MessageDao {
    Connection connection = null;//MyDB.getConnection(DBUrl, DBUser, DBPwd);

    public ResultSet getMessageByChannelID(int channelID) throws SQLException {
        ResultSet result;
        PreparedStatement st;
        st = connection.prepareStatement("select * from channel where id=?");
        st.setInt(1, channelID);
        result = st.executeQuery();
        return result;
    }

    public ResultSet getMessageByMessageID(int messageID) throws SQLException {
        ResultSet result;
        PreparedStatement st;
        st = connection.prepareStatement("select from message where id=?");
        st.setInt(1, messageID);
        result = st.executeQuery();
        return result;
    }

    public ResultSet getMessageAfterMessageID(int messageID) throws SQLException {
        ResultSet result;
        PreparedStatement st;
        st = connection.prepareStatement("select * from message where id >= ?");
        st.setInt(1, messageID);
        result = st.executeQuery();
        return result;
    }

    public ResultSet getMessageAfterTime(Date date) throws SQLException {
        ResultSet result;
        PreparedStatement st;
        st = connection.prepareStatement("");
        //st.setInt(1, messageID);
        result = st.executeQuery();
        return result;
    }
}