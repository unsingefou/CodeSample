require 'grape'
require 'activeresource_apartment_tools'

class Hotels < Grape::API

  helpers ActiveResourceHelpers

  before do
    ActiveResourceHelpers.storeSubdomain(request)
  end

  helpers do
    params :auth_data do
      requires :user_email, type: String
      requires :auth_token, type: String
    end

    params :list do
      optional :pageIndex, type: Integer, desc: "current page"
      optional :pageSize, type: Integer, desc: "items per page"
      optional :sortField, type: String, desc: "sort field"
      optional :sortOrder, type: String, desc: "sort order"
    end

    params :model do
      requires :name, type: String
      requires :city, type: String
      requires :state, type: String
      requires :description, type: String
    end
  end

  desc 'get hotels'
  params do
    use :auth_data
    use :list
    optional :name, type: String, desc: "name of hotel"
  end
  get '/' do
    filters = {}
    filters[:name] = params[:name] if params[:name].present?
    filters[:city] = params[:city] if params[:city].present?

    data = {
      user_email: params[:user_email],
      auth_token: params[:auth_token],
      pageIndex: params[:pageIndex],
      pageSize: params[:pageSize],
      sortOrder: params[:sortOrder],
      sortField: params[:sortField],
      filters: filters
    }
    h = HotelPrototype.all(:params => data)
    return {data: h, itemsCount: h.itemsCount}
  end

  desc 'new hotel'
  params do
    use :auth_data
    use :model
  end
  post '/' do
    data = {
      user_email: params[:user_email],
      auth_token: params[:auth_token],
      name: params[:name],
      city: params[:city],
      state: params[:state],
      description: params[:description]
    }
    h = HotelPrototype.new(data)
    h.save
  end

  desc 'update hotel'
  params do
    use :auth_data
    requires :id, type: String, desc: "id of hotel to be updated"
    use :model
  end

  put '/:id' do
    data = {
      user_email: params[:user_email],
      auth_token: params[:auth_token],
      name: params[:name],
      city: params[:city],
      state: params[:state],
      description: params[:description]
    }
    h = HotelPrototype.find(params[:id], params: data).update_attributes(data)
  end

  desc 'get a hotel'
  params do
    use :auth_data
  end

  get '/:id' do
    data = {
      user_email: params[:user_email],
      auth_token: params[:auth_token],
    }
    h = HotelPrototype.find(params[:id], params: data)
  end

  desc 'delete a hotel'
  params do
    use :auth_data
    requires :id, type: String, desc: "id of hotel to be deleted"
  end

  delete '/:id' do
    data = {
      user_email: params[:user_email],
      auth_token: params[:auth_token],
    }
    h = HotelPrototype.delete(params[:id], data)
  end

end
