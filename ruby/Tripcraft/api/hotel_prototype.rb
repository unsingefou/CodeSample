require 'grape'
require 'grape-swagger'

class HotelPrototype < Grape::API
  content_type :json, 'application/json'

  default_format :json
  format :json

  desc 'list hotels'
  params do
    optional :pageIndex, type: Integer, desc: "current page"
    optional :pageSize, type: Integer, desc: "items per page"
    optional :sortField, type: String, desc: "sort field"
    optional :sortOrder, type: String, desc: "sort order"
    optional :filters
  end
  get '/' do
    if params[:pageIndex]
      params[:sortField] = "name" if params[:sortField].blank?
      params[:sortOrder] = "ASC" if params[:sortOrder].blank?
      params[:filters] = {} if params[:filters].blank?
      query = []
      params[:filters].each { |k, v|
        query.push("#{k} LIKE :#{k}")
        params[:filters][k] = "%#{v}%"
      }
      where = query.join(" and ")
      # The query actually looks something like this
      # Hotel.where(["name LIKE :name and state LIKE :state", { name: "%name%", state: "%state%" }])

      hotels = Hotel.order("#{params[:sortField]} #{params[:sortOrder].upcase}")
        .where(where, params[:filters])
        .paginate(page: params[:pageIndex], per_page: params[:pageSize])
        
      return {total_count: hotels.count, items: hotels}
    else
      Hotel.all
    end
  end

  desc 'create a new hotel'
  params do
    requires :name
    requires :city
    requires :state
    requires :description
  end
  post '/' do
    data = {
      name: params[:name],
      city: params[:city],
      state: params[:state],
      description: params[:description]
    }
    hotel = Hotel.create!(data)
  end

  desc 'get existing hotel'
  get '/:id' do
    hotel = Hotel.find(params[:id])
  end

  desc 'update a hotel'
  params do
    optional :name
    optional :city
    optional :state
    optional :description
  end
  put '/:id' do
    hotel = Hotel.find(params[:id])
    hotel_data = {}
    hotel_data[:name] = params[:name] if params[:name].present?
    hotel_data[:city] = params[:city] if params[:city].present?
    hotel_data[:state] = params[:state] if params[:state].present?
    hotel_data[:description] = params[:description] if params[:description].present?
    hotel.update_attributes(hotel_data)
    hotel
  end


  desc 'delete a hotel'
  delete '/:id' do
    hotel = Hotel.find(params[:id])

    if hotel.present?
      hotel.destroy()
      {}
    else
      status 401
    end
  end
end
